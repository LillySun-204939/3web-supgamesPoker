var languages = {};

languages.getList = function () {
    return {
        fr: 'Français',
        en: 'English',
        de: 'Deutch',
        es: 'Español',
        cn: '中國的',
        it: 'Italiano'
    };
};

languages.printSelect = function (selected, name, id) {
    name = typeof name !== 'undefined' ? name : 'language';
    id = typeof id !== 'undefined' ? id : name;
    var select = '<select id="' + id + '" name="' + name + '">';
    var languagesList = languages.getList();
    Object.keys(languagesList).forEach(function (key) {
        var selectedOption = key == selected ? ' selected="selected"' : '';
        select += '<option value="' + key + '"' + selectedOption + '>' + languagesList[key] + '</option>';
    });
    select += '</select>';
    return select;
};

languages.isKey = function (key) {
    return Object.keys(languages.getList()).indexOf(key) >= 0;
};

module.exports = languages;