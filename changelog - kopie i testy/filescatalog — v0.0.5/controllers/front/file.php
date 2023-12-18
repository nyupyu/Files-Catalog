<?php

class FilescatalogFileModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        parent::initContent();
        $this->setTemplate('module:filescatalog/views/templates/front/filescatalog.tpl');
    }
}


?>
