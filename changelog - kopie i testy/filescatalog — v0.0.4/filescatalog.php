<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Filescatalog extends Module
{
    const MODULE_NAME = 'filescatalog';
    const MODULE_VERSION = '0.0.4';
    const MODULE_JSON_PATH = _PS_MODULE_DIR_ . '/filescatalog/filescatalogdata.json';
    const MODULE_DATA_PATH_CONFIG = 'FILESCATALOG_PATH';

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

        $this->config_path = Configuration::get(self::MODULE_DATA_PATH_CONFIG);
    }

    public function install()
    {
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, _PS_ROOT_DIR_ . '/pliki-do-pobrania/katalog');

        return parent::install() && $this->registerHook('displayHeader') && $this->registerHook('actionAdminControllerSetMedia');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }

    public function saveToJSON($jsonPath)
    {
        $data = $this->processFolderStructure($this->config_path);
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

    public function hookActionAdminControllerSetMedia()
    {
        if (Tools::getValue('controller') === 'AdminModules' && Tools::getValue('configure') === $this->name) {
            $this->context->controller->addJS($this->_path . 'views/js/back.js');
        }
    }

    public function getContent()
    {
        $output = null;

        if (Tools::isSubmit('submitFilescatalog')) {
            $output .= $this->postProcess();
            $output .= $this->displayConfirmation($this->l('Settings updated'));
        }

        $output .= $this->renderForm();

        return $output;
    }

    public function renderForm()
    {
        $fieldsForm = [
            'form' => [
                'legend' => [
                    'title' => $this->l('Settings'),
                ],
                'input' => [
                    [
                        'type' => 'text',
                        'label' => $this->l('Path to Analyze'),
                        'name' => 'filescatalog_path',
                        'size' => 50,
                        'required' => true,
                    ],
                ],
                'submit' => [
                    'title' => $this->l('Save'),
                    'class' => 'btn btn-default pull-right',
                ],
            ],
        ];

        $helper = new HelperForm();
        $helper->module = $this;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->currentIndex = AdminController::$currentIndex.'&configure='.$this->name;
        $helper->default_form_language = (int)Configuration::get('PS_LANG_DEFAULT');
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') ? Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG') : 0;

        $helper->title = $this->displayName;
        $helper->submit_action = 'submitFilescatalog';

        return $helper->generateForm([$fieldsForm]);
    }

    private function postProcess()
    {
        $newPath = Tools::getValue('filescatalog_path');
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, $newPath);
    }

    private function writeJSONToFile($jsonPath, $json)
    {
        return file_put_contents($jsonPath, $json) !== false;
    }
}

?>
