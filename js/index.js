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
        createController
    ]
);

function createController(
    $scope,
    $http,
    filterFilter,
    $mdDialog,
    $mdMedia,
    $mdToast
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

    // $scope.btnAdicionar();
}