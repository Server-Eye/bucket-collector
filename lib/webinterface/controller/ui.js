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
        res.render('index.jade');
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
    res.render('errors.jade');
}

/**
 * Renders the settings-view
 * 
 * @param {Object} req http-request object
 * @param {Object} res http-response object
 * @param {Function} next Follow-up-function, called on successful completion
 */
function settingsView(req, res, next) {
    res.render('settings.jade');
}

function additionalSettings(req, res, next) {
    var reactionName = req.params.name;
    
    if (reactionName && (settings.getAvailableTypes().indexOf(reactionName) >= 0)) {
        res.render('additional-settings.jade');
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
    res.render('partials/seHeader.jade');
}

function settingsInput(req, res, next) {
    res.render('partials/settingsInput.jade');
}

function settingsSelect(req, res, next) {
    res.render('partials/settingsSelect.jade');
}

function settingsAssignment(req, res, next) {
    res.render('partials/settingsAssignment.jade');
}
/**
 * @ignore
 */
(function ($) {
    $.index = index;
    $.additionalSettings = additionalSettings;
    $.errors = errors;
    $.settings = settingsView;
    $.settingsInput = settingsInput;
    $.settingsSelect = settingsSelect;
    $.settingsAssignment = settingsAssignment;
    $.seHeader = seHeader;
})(exports);