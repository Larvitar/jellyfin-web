import * as webSettings from 'webSettings';

var themeStyleElement = document.querySelector('#cssTheme');
var currentThemeId;

function unloadTheme() {
    var elem = themeStyleElement;
    if (elem) {
        elem.removeAttribute('href');
        currentThemeId = null;
    }
}

function getThemes() {
    return webSettings.getThemes();
}

function getThemeStylesheetInfo(id) {
    return getThemes().then(themes => {
        var theme = themes.find(theme => {
            return id ? theme.id === id : theme.default;
        });

        return {
            stylesheetPath: 'themes/' + theme.id + '/theme.css',
            themeId: theme.id
        };
    });
}

function setTheme(id) {
    return new Promise(function (resolve, reject) {
        if (currentThemeId && currentThemeId === id) {
            resolve();
            return;
        }

        getThemeStylesheetInfo(id).then(function (info) {
            if (currentThemeId && currentThemeId === info.themeId) {
                resolve();
                return;
            }

            var linkUrl = info.stylesheetPath;
            unloadTheme();

            let link = themeStyleElement;

            if (!link) {
                // Inject the theme css as a dom element in body so it will take
                // precedence over other stylesheets
                link = document.createElement('link');
                link.id = 'cssTheme';
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                document.body.appendChild(link);
            }

            const onLoad = function (e) {
                e.target.removeEventListener('load', onLoad);
                resolve();
            };

            link.addEventListener('load', onLoad);

            link.setAttribute('href', linkUrl);
            themeStyleElement = link;
            currentThemeId = info.themeId;
        });
    });
}

export default {
    getThemes: getThemes,
    setTheme: setTheme
};
