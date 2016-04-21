var gallery;

gallery = angular.module('gallery', ['widgets']);

gallery.controller('GalleryController', () => {
    let ctrlGallery = {};

    ctrlGallery.platform = process.platform;

    return ctrlGallery;
});
