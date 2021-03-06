define(["globalize", "connectionManager", "require", "loading", "apphost", "dom", "recordingHelper", "events", "registrationServices", "paper-icon-button-light", "emby-button", "css!./recordingfields"], function(globalize, connectionManager, require, loading, appHost, dom, recordingHelper, events, registrationServices) {
    "use strict";

    function onRecordingButtonClick(e) {
        var item = this.item;
        if (item) {
            var serverId = item.ServerId,
                programId = item.Id,
                timerId = item.TimerId,
                timerStatus = item.Status,
                seriesTimerId = item.SeriesTimerId,
                instance = this;
            recordingHelper.toggleRecording(serverId, programId, timerId, timerStatus, seriesTimerId).then(function() {
                instance.refresh(serverId, programId)
            })
        }
    }

    function RecordingButton(options) {
        this.options = options, options.item ? this.refreshItem(options.item) : options.itemId && options.serverId && this.refresh(options.itemId, options.serverId);
        var button = options.button;
        button.querySelector("i").innerHTML = "&#xE061;";
        var clickFn = onRecordingButtonClick.bind(this);
        this.clickFn = clickFn, dom.addEventListener(button, "click", clickFn, {
            passive: !0
        })
    }

    function getIndicatorIcon(item) {
        var status;
        if ("SeriesTimer" === item.Type) return "&#xE062;";
        if (item.TimerId || item.SeriesTimerId) status = item.Status || "Cancelled";
        else {
            if ("Timer" !== item.Type) return "&#xE061;";
            status = item.Status
        }
        return item.SeriesTimerId && "Cancelled" !== status ? "&#xE062;" : "&#xE061;"
    }
    return RecordingButton.prototype.refresh = function(serverId, itemId) {
        var apiClient = connectionManager.getApiClient(serverId),
            self = this;
        apiClient.getItem(apiClient.getCurrentUserId(), itemId).then(function(item) {
            self.refreshItem(item)
        })
    }, RecordingButton.prototype.refreshItem = function(item) {
        var options = this.options,
            button = options.button;
        this.item = item, button.querySelector("i").innerHTML = getIndicatorIcon(item), item.TimerId && "Cancelled" !== (item.Status || "Cancelled") ? button.classList.add("recordingIcon-active") : button.classList.remove("recordingIcon-active")
    }, RecordingButton.prototype.destroy = function() {
        var options = this.options;
        if (options) {
            var button = options.button,
                clickFn = this.clickFn;
            clickFn && dom.removeEventListener(button, "click", clickFn, {
                passive: !0
            })
        }
        this.options = null, this.item = null
    }, RecordingButton
});