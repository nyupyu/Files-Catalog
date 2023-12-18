<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Filescatalog extends Module
{
    public function __construct()
    {
        $this->name = 'filescatalog';
        $this->tab = 'administration';
        $this->version = '1.0.0';
        $this->author = 'Your Name';
        $this->need_instance = 0;

        parent::__construct();

        $this->displayName = $this->l('Files Catalog');
        $this->description = $this->l('A custom module to analyze folder structure and save to JSON.');
    }

    public function install()
    {
        return parent::install() && $this->registerHook('displayHeader');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    public function saveToJSON($jsonPath)
    {
        $data = $this->processFolderStructure(_PS_ROOT_DIR_ . '/');
        $json = json_encode($data);

        if ($this->writeJSONToFile($jsonPath, $json)) {
            echo 'Zapisano dane do pliku JSON.';
        } else {
            echo 'Błąd przy zapisie danych do pliku JSON.';
        }
    }

    public function processFolderStructure($dir)
    {
        $result = array();
        $cdir = scandir($dir);
        foreach ($cdir as $key => $value) {
            if (!in_array($value, array(".", ".."))) {
                if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) {
                    $result[$value] = $this->processFolderStructure($dir . DIRECTORY_SEPARATOR . $value);
                } else {
                    $result[] = $value;
                }
            }
        }
        return $result;
    }

    public function hookDisplayHeader()
    {
        $jsonPath = _PS_MODULE_DIR_ . '/filescatalog/filescatalogdata.json';
        $this->saveToJSON($jsonPath);
    }

    private function writeJSONToFile($jsonPath, $json)
    {
        return file_put_contents($jsonPath, $json) !== false;
    }
}

?>