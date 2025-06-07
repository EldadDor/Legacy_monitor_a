/**
 * Created by vladimir on 19/03/2017.
 */
(function () {
	function DataService($http) {
		console.log("DataService factory");
		this.sourceTypes = [];


		this.astroSources = [
			{
				host: "distribution2",
				name: "astro2",
				link: ""
			},
			{
				host: "distribution3",
				name: "astro3",
				link: ""
			},
			{
				host: "distribution4",
				name: "astro4",
				link: ""
			},
			{
				host: "distribution4",
				name: "astro4",
				link: ""
			},
			{
				host: "distribution5",
				name: "astro5",
				link: ""
			},
			{
				host: "distribution6",
				name: "astro6",
				link: ""
			},
			{
				host: "distribution7",
				name: "astro7",
				link: ""
			},
			{
				host: "distribution8",
				name: "astro8",
				link: ""
			},
			{
				host: "distribution9",
				name: "astro9",
				link: ""
			},
			{
				host: "distribution10",
				name: "astro10",
				link: ""
			}

		];

		this.devSourceTypes = [
			{
				host: "pbbatch",
				port: 9090,
				name: "astro-usertest",
				link: ""
			},
			{
				host: "pbbatch2",
				name: "wizsupport",
				link: ""
			},
			{
				host: "pbbatch3",
				name: "personal-mail-receiver-usertest",
				link: ""
			},
			{
				host: "distribuyest",
				name: "astro-yest",
				link: ""
			},
			{
				host: "distribuqa",
				name: "astro-train",
				link: ""
			},
			{
				host: "distributest",
				name: "pm-pf-cataloger-usertest",
				link: ""
			}
		];

	}

	DataService.prototype.getAllSourceTypesJson = function () {

		this.sourceTypes = $http.get('data.json').success(function(data) {
			return data;
		});
	};


	DataService.prototype.getAllSourceTypes = function () {
		return this.sourceTypes;
	};

	DataService.prototype.getAstroSources = function () {
		return this.astroSources;
	};
	angular.module("MyApp").service("dataService", DataService);
})();