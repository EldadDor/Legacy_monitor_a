/**
 * Widget Footer Directive
 */

appModule.directive('adWidgetFooter', adWidgetFooter);

function adWidgetFooter() {
    var directive = {
        requires: '^adWidget',
        transclude: true,
        template: '<div class="widget-footer" ng-transclude></div>',
        restrict: 'E'
    };
    return directive;
};