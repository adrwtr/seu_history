var App = angular.module(
    'main_app',
    [
        'ngMaterial',
        'ngMdIcons'
    ]
);

App.controller(
    'Controller',
    [
        '$scope',
        '$http',
        'filterFilter',
        '$mdDialog',
        '$mdMedia',
        '$mdToast',
        '$timeout',
        '$mdSidenav',
        '$element',
        createController
    ]
);


function createController(
    $scope,
    $http,
    filterFilter,
    $mdDialog,
    $mdMedia,
    $mdToast,
    $timeout,
    $mdSidenav,
    $element
) {
    $scope.arrHistoricoRecente = [];

    /**
     * botao de adicionar, abre a popup
     */
    $scope.btnAdicionar = function(ev)
    {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;


        // abrir dialogo
        $mdDialog.show(
            {
                controller : DialogController,
                templateUrl : 'inserir_popup.html',
                parent : angular.element(document.body),
                targetEvent : ev,
                clickOutsideToClose : true,
                fullscreen : useFullScreen
            }
        ).then(
            function(answer)
            {
                $scope.getListaHistoricoRecente();

                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Cadastrado com sucesso')
                        .hideDelay(3000)
                );

            },
            function()
            {
                /*$mdToast.show(
                    $mdToast.simple()
                        .textContent('Algum problema ocorreu')
                        .hideDelay(3000)
                );*/
            }
        );

        $scope.$watch(
            function()
            {
                return $mdMedia('xs') || $mdMedia('sm');
            },
            function(wantsFullScreen)
            {
                $scope.customFullscreen = (wantsFullScreen === true);
            }
        );
    };

    /**
     * Listar historicos recentes
     */
    $scope.getListaHistoricoRecente = function()
    {

        $http.get(
            'ajax/listar_historico_dia.php'
        )
        .success(
            function(data){
                if (angular.isArray(data) == true) {
                    $scope.arrHistoricoRecente = data;
                }
            }
        );
    }

    // construct
    $scope.getListaHistoricoRecente();



    /**
     * Controller do dialogo
     */
    function DialogController(
        $scope,
        $mdDialog
    ) {
        /**
         * construtor
         */
        $scope.construtor = function()
        {
            $scope.ds_titulo_dialogo = 'Novo Histórico';
            $scope.autocompleteRequireMatch = false;
            $scope.selectedTags = [];
            $scope.selectedItem = null;
            $scope.searchText = null;
            $scope.querySearch = $scope.querySearch;
            // $scope.vegetables = loadVegetables();

            // novos
            $scope.getListaTags();
            $scope.arrTagsLista = [];
        }

        /**
         * fecha a janela
         */
        $scope.cancel = function()
        {
            $mdDialog.cancel();
        };


        /**
         * Cria um chip baseado no que o usuario digitou
         */
        $scope.transformChip = function(chip)
        {
            if (angular.isObject(chip)) {
                return chip;
            }

            return {
                ds_tag : chip,
                type : 'new'
            }
        }

        /**
         * procura pela string digitada pelo usuario no array de elementos
         */
        $scope.querySearch = function(query)
        {
            var results = query ? $scope.arrTags.filter(
                $scope.createFilterFor(query)
            ) : [];
            return results;
        }

        /**
         * cria um filtro para o array de elementos
         */
        $scope.createFilterFor = function(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(arrTags)
            {
                var ds_teste = arrTags.ds_tag.toLowerCase();
                return (ds_teste.indexOf(lowercaseQuery) === 0);
            };
        }


        /**
         * Listar tags
         */
        $scope.getListaTags = function()
        {

            $http.get(
                'ajax/listar_tags.php'
            )
            .success(
                function(data){
                    if (angular.isArray(data) == true) {
                        $scope.arrTags = data;
                        $scope.arrTagsLista = data;
                    }
                }
            );
        }

        /**
         * envia o post
         * @return {[type]} [description]
         */
        $scope.adicionarHistorico = function()
        {

            if ($scope.me_descricao != '' && $scope.me_descricao != undefined) {
                var arrDados = {
                    me_descricao : $scope.me_descricao,
                    arrTags : $scope.selectedTags
                }

                $http.post(
                    'ajax/incluir_historico.php',
                    arrDados
                )
                .success(
                    function(data){
                        $mdDialog.hide(true);
                        return true;
                    }
                );

                return true;
            }

            $mdDialog.cancel();
        }

        $scope.construtor();
    };



    $scope.toggleLeft = buildDelayedToggler(
        'sidenav_left'
    );

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context)
    {
        var timer;

        return function debounced()
        {
            var context = $scope,
            args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);

            timer = $timeout(
                function()
                {
                    timer = undefined;
                    func.apply(context, args);
                },
                wait || 10
            );
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID)
    {
        return debounce(
            function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(
                        function () {

                        }
                    );
            },
            200
        );
    }

    function buildToggler(navID)
    {
        return function() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    // $log.debug("toggle " + navID + " is done");
                }
            );
        }
    }

    // $scope.btnAdicionar();
    //
    //
    //
    //

        $scope.closeSideNav = function ()
        {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('sidenav_left').close()
                .then(
                    function ()
                    {
                        // $log.debug("close LEFT is done");
                    }
                );
        };


        $scope.arrTagsBusca = [];
        $scope.searchTerm;

        $scope.clearSearchTerm = function() {
            $scope.searchTerm = '';
        };

        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on(
            'keydown',
            function(ev)
            {
                ev.stopPropagation();
            }
        );


        /**
         * Listar tags
         */
        $scope.getListaTags = function()
        {
            $http.get(
                'ajax/listar_tags.php'
            )
            .success(
                function(data){
                    if (angular.isArray(data) == true) {
                        // $scope.arrTagsBusca = data;
                        $scope.arrTagsBusca = [];
                        for (arrTags in data) {
                            $scope.arrTagsBusca.push(
                                data[arrTags].ds_tag
                            );
                        }
                    }
                }
            );
        }

        $scope.doBusca = function()
        {
            var arrDados = {
                dt_inicial : $scope.dt_inicial,
                dt_final : $scope.dt_final,
                arrTags : $scope.arrTagsBuscaSelecionados
            }

            $http.post(
                'ajax/buscar_historico.php',
                arrDados
            )
            .success(
                function(data){
                    $scope.arrHistoricoRecente = data;
                    $scope.closeSideNav();
                }
            );
        }

        $scope.getListaTags();

}



/*App.controller(
    'LeftCtrl',
    function (
        $scope,
        $timeout,
        $mdSidenav,
        $element,
        $http
    ) {


        $scope.getListaTags();
    }
);*/