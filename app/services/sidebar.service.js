(function () {
	function SidebarService($cookieStore) {
		var self = this;
		var mobileView = 992;
		this.toggle = false;
		$cookieStore.put('toggle', false);

		this.toggleSidebar = function () {
			self.toggle = !self.toggle;
			$cookieStore.put('toggle', self.toggle);
		};

		this.toggleOnResize = function (newValue) {
			if (newValue >= mobileView) {
				if (angular.isDefined($cookieStore.get('toggle'))) {
					self.toggle = $cookieStore.get('toggle');
				} else {
					self.toggle = true;
				}
			} else {
				self.toggle = false;
			}
		};
	}
	appModule.service("sidebarService", SidebarService);
})();
//var staticMenuItems = [];
//		this.addStaticItem = function addStaticItem() {
//			staticMenuItems.push.apply(staticMenuItems, arguments);
//		};
//var staticMenuItems = [];
		//this.addStaticItem = function addStaticItem() {
		//	staticMenuItems.push.apply(staticMenuItems, arguments);
		//};
		//
		//
		//function getMenuItems() {
		//	var states = defineMenuItemStates();
		//	var menuItems = states.filter(function (item) {
		//		return item.level == 0;
		//	});
		//	menuItems.forEach(function (item) {
		//		var children = states.filter(function (child) {
		//			return child.level == 1 && child.name.indexOf(item.name) === 0;
		//		});
		//		item.subMenu = children.length ? children : null;
		//	});
		//	return menuItems.concat(staticMenuItems);
		//}

		//this.shouldMenuBeCollapsed = shouldMenuBeCollapsed;
		//this.canSidebarBeHidden = canSidebarBeHidden;
		//this.setMenuCollapsed = function (isCollapsed) {
		//	isMenuCollapsed = isCollapsed;
		//};
		//this.isMenuCollapsed = function () {
		//	return isMenuCollapsed;
		//};
		//this.toggleMenuCollapsed = function () {
		//	isMenuCollapsed = !isMenuCollapsed;
		//};
		//this.getAllStateRefsRecursive = function (item) {
		//	var result = [];
		//	_iterateSubItems(item);
		//	return result;
		//	function _iterateSubItems(currentItem) {
		//		currentItem.subMenu && currentItem.subMenu.forEach(function (subItem) {
		//			subItem.stateRef && result.push(subItem.stateRef);
		//			_iterateSubItems(subItem);
		//		});
		//	}
		//};
		//
		//function defineMenuItemStates() {
		//	return $state.get()
		//		.filter(function (s) {
		//			return s.sidebarMeta;
		//		})
		//		.map(function (s) {
		//			var meta = s.sidebarMeta;
		//			return {
		//				name: s.name,
		//				title: s.title,
		//				level: (s.name.match(/\./g) || []).length,
		//				order: meta.order,
		//				icon: meta.icon,
		//				stateRef: s.name,
		//			};
		//		})
		//		.sort(function (a, b) {
		//			return (a.level - b.level) * 100 + a.order - b.order;
		//		});
		//}
		//
		//function shouldMenuBeCollapsed() {
		//	return window.innerWidth <= layoutSizes.resWidthCollapseSidebar;
		//}
		//
		//function canSidebarBeHidden() {
		//	return window.innerWidth <= layoutSizes.resWidthHideSidebar;
		//}
