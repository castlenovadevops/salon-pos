export default class NetworkManager{

    // var condition = navigator.onLine ? 'online' : 'offline';
    checkInternet() {
        return  navigator.onLine ? true : false;
    }

}