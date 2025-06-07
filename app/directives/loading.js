/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */

appModule.directive('adLoading', adLoading);

function adLoading() {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};