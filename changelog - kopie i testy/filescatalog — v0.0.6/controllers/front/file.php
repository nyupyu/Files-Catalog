<?php

class FilescatalogFileModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        parent::initContent();

        // Tutaj możesz dodawać lub modyfikować treść strony
        $this->context->smarty->assign(array(
            'customContent' => '<p>Dodatkowa treść dla strony</p>',
        ));

        // Przykład dodawania skryptu JS
        $this->addJS($this->module->getPathUri() . 'views/js/front.js');

        // Przykład dodawania stylu CSS
        $this->addCSS($this->module->getPathUri() . 'views/css/front.css');

        // Ustawiasz pusty szablon, ponieważ treść strony jest dynamicznie dodawana
        $this->setTemplate('module:filescatalog/views/templates/front/empty.tpl');
    }
}



?>
