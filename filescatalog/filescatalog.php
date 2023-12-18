<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Filescatalog extends Module
{
    const MODULE_NAME = 'filescatalog';
    const MODULE_VERSION = '0.1.1';
    const MODULE_JSON_PATH = _PS_MODULE_DIR_ . '/' . self::MODULE_NAME . '/views/json/data.json';
    const MODULE_DATA_PATH_CONFIG = 'FILESCATALOG_PATH';

    public function __construct()
    {
        $this->name = self::MODULE_NAME;
        $this->tab = 'administration';
        $this->version = self::MODULE_VERSION;
        $this->author = 'Oktawian';
        $this->need_instance = 0;

        parent::__construct();

        $this->displayName = $this->trans('Files Catalog');
        $this->description = $this->trans("A custom module to analyze folder structure and show client's download center.");

        $this->config_path = Configuration::get(self::MODULE_DATA_PATH_CONFIG);
        $this->registerHook('displayOverrideTemplate');
        $this->registerHook('actionDispatcher');
    }

    public function install()
    {
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, _PS_ROOT_DIR_ . '/download-center/catalog');

        return parent::install() && $this->registerHook('displayHeader') && $this->registerHook('actionAdminControllerSetMedia');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }


    public function getContent()
    {
        $output = null;

        if (Tools::isSubmit('submitFilescatalog')) {
            $output .= $this->postProcess();
            $output .= $this->displayConfirmation($this->trans('Settings updated'));
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
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, _PS_ROOT_DIR_ . '/' . $newPath);
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
    private function writeJSONToFile($jsonPath, $json)
    {
        return file_put_contents($jsonPath, $json) !== false;
    }


    // HOOKS HERE


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

    public function hookDisplayOverrideTemplate($params)
    {
    $controller_name = Tools::getValue('controller');
    $id_cms = Tools::getValue('id_cms');

    if ($controller_name === 'cms' && $id_cms == '9') {
        return $this->getFrontController();
    }

    return null; // Nie zmieniaj szablonu dla innych stron
    }


    public function hookActionDispatcher($params)
    {
    $controller = $params['controller'];
    if ($controller instanceof FrontController && $controller->php_self === 'filescatalog') {
        $this->getFrontController();
    }
    }

    // CONTROLLER

    private function getFrontController()
    {
        Tools::redirect($this->context->link->getModuleLink('filescatalog', 'file'));
    }
}

?>