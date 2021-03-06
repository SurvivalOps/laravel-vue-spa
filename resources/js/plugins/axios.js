import axios from 'axios';
import store from '~/store'
import router from '~/router'
import Swal from 'sweetalert2'
import i18n from '~/plugins/i18n'
var join = require('url-join');
var isAbsoluteURLRegex = /^(?:\w+:)\/\//;

// Request interceptor
axios.interceptors.request.use((config) => {
    // Do something before request is sent
    if ( !isAbsoluteURLRegex.test(config.url) ) {
        config.url = join('http://laravel-vue-spa.local/', config.url);
   }
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error);
});

// Response interceptor
axios.interceptors.response.use(response => response, error => {
    const { status } = error.response

    if (status >= 500) {
        Swal.fire({
            type: 'error',
            title: i18n.t('error_alert_title'),
            text: i18n.t('error_alert_text'),
            reverseButtons: true,
            confirmButtonText: i18n.t('ok'),
            cancelButtonText: i18n.t('cancel')
        })
    }

    if (status === 403 && store.getters['auth/check']) {
        Swal.fire({
            type: 'error',
            title: i18n.t('error_insufficient_title'),
            text: i18n.t('error_insufficient_permission'),
            reverseButtons: true,
            confirmButtonText: i18n.t('ok'),
            cancelButtonText: i18n.t('cancel')
        })
            .then(() => {
                router.push({ name: 'home' })
            })
    }

    if (status === 401 && store.getters['auth/check']) {
        Swal.fire({
            type: 'warning',
            title: i18n.t('token_expired_alert_title'),
            text: i18n.t('token_expired_alert_text'),
            reverseButtons: true,
            confirmButtonText: i18n.t('ok'),
            cancelButtonText: i18n.t('cancel')
        }).then(() => {
            store.commit('auth/LOGOUT')

            router.push({ name: 'login' })
        })
    }

    return Promise.reject(error)
})
