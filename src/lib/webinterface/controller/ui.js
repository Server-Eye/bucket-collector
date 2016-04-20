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

/**
 * Renders the additional-settings-view for the given reaction.
 * Redirects to the index-view the reaction does not exist.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function additionalSettings(req, res, next) {
    var reactionName = req.params.name;

    if (reactionName && (settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        res.render('additional-settings.pug');
    } else {

        res.redirect('/');
    }
}

/**
 * Redirects to the additional-settings-view for the currently selected reaction
 * Redirects to the index-view the reaction does not exist.
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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

/**
 * Renders the input-partial for settings
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function settingsInput(req, res, next) {
    res.render('partials/settingsInput.pug');
}

/**
 * Renders the select-partial for settings
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function settingsSelect(req, res, next) {
    res.render('partials/settingsSelect.pug');
}

/**
 * Renders the assignment-partial for settings
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
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