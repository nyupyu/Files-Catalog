<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Filescatalog extends Module
{
    const MODULE_NAME = 'filescatalog';
    const MODULE_VERSION = '0.0.3';
    const MODULE_JSON_PATH = _PS_MODULE_DIR_ . '/filescatalog/filescatalogdata.json';
    const MODULE_DATA_PATH = _PS_ROOT_DIR_ . '/pliki-do-pobrania/katalog';

    public function __construct()
    {
        $this->name = self::MODULE_NAME;
        $this->tab = 'administration';
        $this->version = self::MODULE_VERSION;
        $this->author = 'Oktawian';
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
        $data = $this->processFolderStructure(self::MODULE_DATA_PATH);
        $json = json_encode($data, JSON_PRETTY_PRINT);

        return $this->writeJSONToFile($jsonPath, $json);
    }

    public function processFolderStructure($directory)
    {
        $result = array();
        $contents = scandir($directory);

        foreach ($contents as $item) {
            if (!in_array($item, array(".", ".."))) {
                $path = $directory . DIRECTORY_SEPARATOR . $item;

                if (is_dir($path)) {
                    $result[$item] = $this->processFolderStructure($path);
                } else {
                    $result[] = $item;
                }
            }
        }

        return $result;
    }

    public function hookDisplayHeader()
    {
        $this->saveToJSON(self::MODULE_JSON_PATH);
    }

    private function writeJSONToFile($jsonPath, $json)
    {
        return file_put_contents($jsonPath, $json) !== false;
    }
}

?>
