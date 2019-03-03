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

    new Vue({
        el: '#app',
        data: {
            consoleHTML: '',
            readyToInput: false,
            rowContent: '',
            scrollEnabled: false
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
                this.consoleHTML += text;
                if (this.scrollEnabled) {
                    scrollBottom();
                }
            },
            addToCommand: function (text) {
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
            newLine: function (silent) {
                this.addToHtml(templates.login, silent);
                this.clearCommand();
            },
            handleCommand: function () {
                const command = this.rowContent.toLowerCase();
                if (ALLOW_COMMANDS.indexOf(command) !== -1) {
                    this.addToHtml(templates.commands[command])
                } else if (command.length !== 0) {
                    this.addToHtml(templates.commands.notFound);
                } else {
                    this.addToHtml('<br>');
                }
            }
        },
        created: function () {
            const self = this;
            this.addToHtml(templates.init);
            this.newLine();

            ALLOW_COMMANDS.forEach(function (item) {
                self.addToHtml(item);
                self.addToHtml(templates.commands[item]);
                self.newLine();
            });

            this.scrollEnabled = true;

            if ((new MobileDetect(window.navigator.userAgent)).mobile()) {
                setTimeout(function () {
                    document.getElementById('mobile-text').style.display = "block";
                }, 100);
            }
            window.addEventListener('keydown', this.onKey);
        }
    });
})();
