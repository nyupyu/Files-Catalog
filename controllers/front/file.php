<?php

class FilescatalogFileModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        parent::initContent();

        $this->context->controller->addJS($this->module->getPathUri() . 'views/js/front.js', 'module');

        $jsonFilePath = $this->module->getPathUri() . 'views/json/data.json';
        Media::addJsDef(array('jsonFilePath' => $jsonFilePath));

        $this->addCSS($this->module->getPathUri() . 'views/css/front.css');

        $this->setTemplate('module:filescatalog/views/templates/front/filescatalog.tpl');
    }

}

?>
