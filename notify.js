class Notify {

    constructor(config) {
        this.parentCss = {
            position: "fixed",
            top: "-100px",
            right: "5px",
            zIndex: "900000",
            padding: "10px 0",
            marginBottom: "0px",
            width: "350px"
        }
        this._elements = {
            parent: null,
            label: null,
            p: null,
            msgContainer: null,
            icon: null,
            iconWrapper: null,
            close_button: null,
            btnWrapper: null,
            buttons: []
        }
        this._currentType = null;
        this._timeOut = null;
        this._defaultConfig = {
            message: '',
            header: '',
            type: 'info',
            autoCloseDuration: 3000,
            withIcon: true,
            msgType: 'info',
        }
        this.options = {};


        this.options = this._defaultConfig;
        if (config) {
            this.options = $.extend(this._defaultConfig, config, true);
        }

        if (this.options.msgType == 'confirm' || this.options.msgType == 'input') {
            this.options.type = this.options.msgType;
        }

        this._elements.parent = document.createElement("div");
        this._elements.parent.className = 'alert text-left alert-dismissible';
        this._elements.parent.style = this.parentCss;
        Object.assign(this._elements.parent.style, this.parentCss);

        this._elements.msgContainer = document.createElement("div");

        this._elements.lable = document.createElement("h4");
        this._elements.lable.style.fontSize = '18px';
        this._elements.lable.innerHTML = (this.options.type === "success" ? "SUCCESSFULL" : "ERROR!")

        this._elements.p = document.createElement("p");
        this._elements.p.style.fontSize = '14px';
        this._elements.p.innerHTML = this.options.message;

        this._elements.iconWrapper = document.createElement("div");
        this._elements.iconWrapper.className = 'pull-left';
        Object.assign(this._elements.iconWrapper.style, {
            position: 'absolute',
            height: '100%',
            width: '50px',
            fontSize: '38px',
            top: 0,
            paddingLeft: '4px'
        });

        this._elements.icon = document.createElement("span");
        this._elements.icon.style.fontSize = '38px';
        this._elements.icon.style.position = 'absolute';
        this._elements.icon.style.top = '50%';
        this._elements.icon.style.marginTop = '-20px';
        this._elements.iconWrapper.appendChild(this._elements.icon);

        this._elements.button = document.createElement("button");
        this._elements.button.type = "button";
        this._elements.button.className = "close";
        this._elements.button.dataset.dismiss = 'alert';
        this._elements.button.style.right = 0;
        this._elements.button.style.top = '-5px!important';
        this._elements.button.innerHTML = '&times;';

        if (this.options.msgType == "confirm") {
            // create button Wrapper
            this._elements.btnWrapper = document.createElement("div");
            this._elements.btnWrapper.style = 'text-align: right;padding-right: 10px;'
            // create buttons
            if (this.options.buttons.length > 0) {
                var hasCloseBtn = false;

                for (var i = 0; i < this.options.buttons.length; i++) {
                    var btnConfig = this.options.buttons[i];
                    if (btnConfig.role && btnConfig.role == 'cancel') {
                        hasCloseBtn = true
                    }
                    var btn = document.createElement("button");
                    if (btnConfig.cssClass) {
                        btn.className = btnConfig.cssClass + ' mr-1';
                    } else {
                        btn.className = 'btn btn-sm btn-default';
                    }
                    if (btnConfig.text) {
                        btn.innerHTML = btnConfig.text;
                    } else {
                        btn.innerHTML = 'OK';
                    }
                    if (btnConfig.action) {
                        btn.addEventListener('click', function () {
                            btnConfig.action();
                            $(this).closest('.alert').hide(500, function () {
                                $(this).remove();
                            });
                        });
                    } else {
                        btn.addEventListener('click', this._closeAlert());
                    }
                    this._elements.buttons.push(btn);
                }

                this.options.buttons.forEach(function (btnConfig) {

                });
                if (!hasCloseBtn) {
                    var btn = document.createElement("button");
                    $(btn).addClass('btn btn-sm btn-default  mr-1').html('Cancel').click(function () {
                        $(this).closest('.alert').hide(500, function () {
                            $(this).remove();
                        });
                    });
                    this._elements.buttons.push(btn);
                }
            }
        }
    }

    setType(type) {
        this._currentType = this.options.type;
        this.options.type = type;
        this._assignAlertType();
        this._elements.lable.innerHTML = this._getLabelString();
    }

    setMessage(message) {
        this.options.message = message;
        this._elements.p.innerHTML = this.options.message
    }

    update(message, type) {
        this.setMessage(message);
        this.setType(type);
    }

    present() {
        this._assemble();
        $('body').append(this._elements.parent);
        var prt = this._elements.parent;
        var acd = this.options.autoCloseDuration;
        var canTimeout = this._canTimeOut();

        $(this._elements.parent).animate({top: "10px"}, 500, function () {
            if (acd > 0 && canTimeout) {
                this._timeOut = setTimeout(function () {
                    $(prt).hide(500, function () {
                        $(prt).remove();
                    });
                }, acd);
            }
        });
        return this;
    }

    _assemble() {
        this._elements.lable.innerHTML = this._getLabelString();

        if (this.options.withIcon) {
            this._elements.parent.appendChild(this._elements.iconWrapper);
            this._elements.msgContainer.style = "padding-left:55px";
        }
        $(this._elements.msgContainer).append(this._elements.lable, this._elements.p);
        if (this.options.autoCloseDuration == 0) {
            $(this._elements.msgContainer).append(this._elements.button);
        }

        if (this._canShowButtons()) {
            for (var i = 0; i < this._elements.buttons.length; i++) {
                var btn = this._elements.buttons[i];
                $(this._elements.btnWrapper).append(btn);
            }

            $(this._elements.msgContainer).append(this._elements.btnWrapper);
        }

        $(this._elements.parent).append(this._elements.msgContainer);

        this._assignAlertType();
    }

    _activateTimeout() {
        var prt = this._elements.parent;
        var acd = this.options.autoCloseDuration;

        if (this._timeOut) {
            clearTimeout(this._timeOut);
        }
        if (acd > 0 && this._canTimeOut()) {
            this._timeOut = setTimeout(function () {
                $(prt).hide(500, function () {
                    $(prt).remove();
                });
            }, acd);
        }
    }

    _getLabelString() {
        if (this.options.header != '') {
            return this.options.header;
        } else {
            switch (this.options.type) {
                case 'success':
                    return "SUCCESSFULL";
                    break;
                case 'danger':
                case 'error':
                    return "ERROR!";
                    break;
                case 'warning':
                    return "WARNING!";
                    break;
                case 'info':
                    return "INFORMATION!";
                    break;
                case 'loading':
                    return "PROCESSING";
                    break;
                case 'confirm':
                    return "CONFIRM?";
                    break;
                case 'input':
                    return "FILL THE FIELDS";
                    break;
                default:
                    return "";
                    break;
            }
        }
    }

    _canTimeOut() {
        if (this.options.type == 'loading' || this.options.msgType == 'confirm') {
            return false;
        }
        return true;
    }

    _canShowButtons() {
        if (this.options.type == 'loading' || this.options.msgType == 'confirm') {
            return true;
        }
        return false;
    }

    _assignAlertType() {
        var className = '';
        var iconClassName = '';
        switch (this.options.type) {
            case 'success':
                className = "success";
                iconClassName = "fas fa-check-circle";
                break;
            case 'danger':
            case 'error':
                iconClassName = "fas fa-times-circle";
                className = "danger";
                break;
            case 'warning':
                className = "warning";
                iconClassName = "fas fa-exclamation-triangle";
                break;
            case 'info':
                className = "info";
                iconClassName = "fas fa-info-circle";
                break;
            case 'loading':
                className = "info";
                iconClassName = "fas fa-spinner fa-spin";
                break;
            case 'confirm':
                className = "info";
                iconClassName = "fas fa-question-circle";
                break;
            case 'input':
                className = "info";
                iconClassName = "fas fa-edit";
                break;
            default:
                className = "info";
                break;
        }


        var activeClass = this._elements.parent.className;

        if (this._currentType) {
            activeClass = activeClass.replace(this._getReplacingClass(), ('alert-' + className));
        } else {
            activeClass = activeClass.concat(" ", ('alert-' + className));
        }
        this._elements.parent.className = activeClass;
        this._elements.iconWrapper.className = ('bg-' + className)
        this._elements.icon.className = iconClassName.concat(' ', 'text-white');

        if (this._canTimeOut()) {
            $(this._elements.button).hide();
        } else {
            $(this._elements.button).show();
        }
        this._activateTimeout();
    }

    _getReplacingClass() {
        switch (this._currentType) {
            case 'success':
                return "alert-success";
                break;
            case 'danger':
            case 'error':
                return "alert-danger";
                break;
            case 'warning':
                return "alert-warning";
                break;
            case 'info':
                return "alert-info";
                break;
            case 'loading':
                return "alert-info";
                break;
            default:
                return null;
                break;
        }
    }

    _closeAlert() {
        var parent = this._elements.parent;
        $(parent).hide(500, function () {
            $(parent).remove();
        });
    }

}
