(function () {
    const scrollBottom = function () {
        setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    };

    const ALLOW_COMMANDS = ['help', 'photo', 'info', 'skills', 'cv', 'contact'];

    const templates = {
        init: document.getElementById('template-init').innerHTML,
        login: document.getElementById('template-new-line').innerHTML,
        commands: {
            help: document.getElementById('template-command-help').innerHTML,
            info: document.getElementById('template-command-info').innerHTML,
            skills: document.getElementById('template-command-skills').innerHTML,
            cv: document.getElementById('template-command-cv').innerHTML,
            photo: document.getElementById('template-command-photo').innerHTML,
            contact: document.getElementById('template-command-contact').innerHTML,
            notFound: document.getElementById('template-command-not-found').innerHTML
        }
    };

    var app = new Vue({
        el: '#app',
        data: {
            consoleHTML: '',
            readyToInput: false,
            rowContent: '',
            renderComponent: false
        },
        methods: {
            onKey: function (e) {
                if (e.keyCode === 76 && e.ctrlKey) {
                    this.clearHtml();
                    this.newLine();
                } else if (e.keyCode === 8) {
                    this.deleteSymbol();
                } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
                    this.addToHtml(e.key);
                    this.addToCommand(e.key);
                } else if (e.keyCode === 13) {
                    this.handleCommand();
                    this.newLine();
                }
            },
            addToHtml: function (text) {
                console.log(text);
                this.consoleHTML += text;
                scrollBottom();
            },
            addToCommand: function (text, del) {
                this.rowContent += text;
            },
            clearCommand: function () {
                this.rowContent = '';
            },
            clearHtml: function () {
                this.consoleHTML = '';
            },
            deleteSymbol: function () {
                if (this.rowContent.length === 0) {
                    return
                }
                this.rowContent = this.rowContent.substring(0, this.rowContent.length - 1);
                this.consoleHTML = this.consoleHTML.substring(0, this.consoleHTML.length - 1);
            },
            newLine: function () {
                this.addToHtml(templates.login);
                this.clearCommand();
            },
            handleCommand: function () {
                const command = this.rowContent.toLowerCase();
                if (ALLOW_COMMANDS.indexOf(command) !== -1) {
                    this.addToHtml(templates.commands[command])
                } else {
                    this.addToHtml(templates.commands.notFound);
                }
            }
        },
        created: function () {
            const self = this;
            this.addToHtml(templates.init);
            this.newLine();

            ALLOW_COMMANDS.forEach(function (item) {
                for (var i = 0; i < item.length; i++) {
                    self.addToHtml(item[i]);
                }
                self.addToHtml(templates.commands[item]);
                self.newLine();
            });

            var md = new MobileDetect(window.navigator.userAgent);
            if (md.mobile()) {
                setTimeout(function () {
                    document.getElementById('mobile-text').style.visibility = "visible";
                }, 100);
            }

            window.addEventListener('keydown', this.onKey);
        },
        beforeDestroy: function () {
            window.removeEventListener('keydown', this.onKey);
        }
    });
})();
