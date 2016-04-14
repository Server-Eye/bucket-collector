var settings = require('../../dataStore').settings;

/**
 * Renders the index-view if all required settings are set, redirect to `/settings` if not
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function index(req, res, next) {
    if (typeof settings.checkSettings() === 'boolean' && settings.checkSettings()) {
        res.render('index.pug');
    } else {
        res.redirect('/settings');
    }
}

/**
 * Renders the error-view
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function errors(req, res, next) {
    res.render('errors.pug');
}

/**
 * Renders the settings-view
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function settingsView(req, res, next) {
    res.render('settings.pug');
}

function additionalSettings(req, res, next) {
    var reactionName = req.params.name;

    if (reactionName && (settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        res.render('additional-settings.pug');
    } else {

        res.redirect('/');
    }
}

function additionalSettingsSelect(req, res, next) {
    var reactionName = settings.getType();
    if (settings.getType()) {
        res.redirect('/settings/reaction/' + reactionName);
    } else {
        res.redirect('/');
    }
}

/**
 * Renders the se-header-partial
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function seHeader(req, res, next) {
    res.render('partials/seHeader.pug');
}

function settingsInput(req, res, next) {
    res.render('partials/settingsInput.pug');
}

function settingsSelect(req, res, next) {
    res.render('partials/settingsSelect.pug');
}

function settingsAssignment(req, res, next) {
    res.render('partials/settingsAssignment.pug');
}
/**
 * @ignore
 */
(function($) {
    $.index = index;
    $.additionalSettings = additionalSettings;
    $.additionalSettingsSelect = additionalSettingsSelect;
    $.errors = errors;
    $.settings = settingsView;
    $.settingsInput = settingsInput;
    $.settingsSelect = settingsSelect;
    $.settingsAssignment = settingsAssignment;
    $.seHeader = seHeader;
})(exports);