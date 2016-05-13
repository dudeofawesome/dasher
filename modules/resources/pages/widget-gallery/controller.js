var gallery;

gallery = angular.module('gallery', ['UIwidgets']);

gallery.controller('GalleryController', () => {
    let ctrlGallery = {};

    ctrlGallery.platform = process.platform;

    return ctrlGallery;
});
