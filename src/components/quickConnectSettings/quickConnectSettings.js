import globalize from 'globalize';
import toast from 'toast';

export class QuickConnectSettings {
    constructor() { }

    authorize(code) {
        let url = ApiClient.getUrl('/QuickConnect/Authorize?Code=' + code);
        ApiClient.ajax({
            type: 'POST',
            url: url
        }, true).then(() => {
            toast(globalize.translate('QuickConnectAuthorizeSuccess'));
        }).catch(() => {
            toast(globalize.translate('QuickConnectAuthorizeFail'));
        });

        // prevent bubbling
        return false;
    }

    activate() {
        let url = ApiClient.getUrl('/QuickConnect/Activate');
        return ApiClient.ajax({
            type: 'POST',
            url: url
        }).then(() => {
            toast(globalize.translate('QuickConnectActivationSuccessful'));
            return true;
        }).catch((e) => {
            console.error('Error activating quick connect. Error:', e);
            Dashboard.alert({
                title: globalize.translate('HeaderError'),
                message: globalize.translate('DefaultErrorMessage')
            });
            throw e;
        });
    }
}

export default QuickConnectSettings;
