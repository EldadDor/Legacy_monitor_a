/**
 * Widget Header Directive
 */

appModule.directive('adWidgetHeader', adWidgetTitle);

function adWidgetTitle() {
    var directive = {
        requires: '^adWidget',
        scope: {
            title: '@',
            icon: '@',
            classes: '@?'
        },
        transclude: true,
        template: '<div class="widget-header" ng-class="classes"><div class="row"><div class="float-left"><i ng-class="icon"></i> {{title}} </div><div class="ml-auto" ng-transclude></div></div></div>',
        restrict: 'E'
    };
    return directive;
};