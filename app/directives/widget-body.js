/**
 * Widget Body Directive
 */

appModule.directive('adWidgetBody', adWidgetBody);

function adWidgetBody() {
    var directive = {
        requires: '^adWidget',
        scope: {
            loading: '=?',
            classes: '@?'
        },
        transclude: true,
        template: '<div class="widget-body" ng-class="classes"><ad-loading ng-show="loading"></ad-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
        restrict: 'E'
    };
    return directive;
};
