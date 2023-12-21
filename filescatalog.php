<?php

if (!defined('_PS_VERSION_')) {
    exit;
}

class Filescatalog extends Module
{
    const MODULE_NAME = 'filescatalog';
    const MODULE_VERSION = '0.1.4';
    const MODULE_JSON_PATH = _PS_MODULE_DIR_ . '/' . self::MODULE_NAME . '/views/json/data.json';
    const MODULE_DATA_PATH_CONFIG = 'FILESCATALOG_PATH';
    const MODULE_DATA_ID_CONFIG = 'FILESCATALOG_ID';

    public function __construct()
    {
        $this->name = self::MODULE_NAME;
        $this->tab = 'front_office_features';
        $this->version = self::MODULE_VERSION;
        $this->author = 'nyupyu';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = [
        'min' => '8.0',
        'max' => '8.99.99'
        ];
        $this->bootstrap = false;

        parent::__construct();

        $this->displayName = $this->l('Files Catalog');
        $this->description = $this->l('A custom module to show files catalog on page by replacing indicated page ID.');

        $this->config_path = Configuration::get(self::MODULE_DATA_PATH_CONFIG);
        $this->config_id = Configuration::get(self::MODULE_DATA_ID_CONFIG);

        $this->registerHook('displayOverrideTemplate');
    }

    public function install()
    {
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, _PS_ROOT_DIR_ . '/');
        Configuration::updateValue(self::MODULE_DATA_ID_CONFIG, '-1');

        return parent::install() && $this->registerHook('actionAdminControllerSetMedia') && $this->registerHook('actionDispatcher');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }


public function getContent()
{
    $output = null;

    if (Tools::isSubmit('submitFilescatalog')) {
        // Wywołaj funkcję odpowiedzialną za przetwarzanie formularza
        $output .= $this->postProcess();
        $output .= $this->displayConfirmation($this->l('Settings updated'));
    }

    // Sprawdź, czy został naciśnięty przycisk do wykonania niestandardowej akcji
    if (Tools::isSubmit('submitRefresh')) {
        // Wywołaj funkcję niestandardową
        $this->saveToJSON(self::MODULE_JSON_PATH);
        $output .= $this->displayConfirmation($this->l('The catalog has been updated.'));
    }

    // Wyświetl formularz
    $output .= $this->displayForm();

    return $output;
}


    public function displayForm()
    {
    $fieldsForm = [
        'form' => [
            'legend' => [
                'title' => $this->l('Settings'),
            ],
            'input' => [
                [
                    'type' => 'text',
                    'label' => $this->l('Path to Analyze: public_html/'),
                    'name' => 'filescatalog_path',
                    'size' => 50,
                    'required' => true,
                    'value' => '',
                ],
                [
                    'type' => 'text',
                    'label' => $this->l('ID of page to replace: '),
                    'name' => 'filescatalog_id',
                    'size' => 50,
                    'required' => true,
                ],
            ],
            'submit' => [
                'title' => $this->l('Save'),
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

    $form = $helper->generateForm([$fieldsForm]);

    // Dodaj przycisk do wywołania dodatkowej funkcji
    $customButton = $this->getCustomButton();
    $form .= $customButton;

    return $form;
    }
    public function getCustomButton()
{
    $button = '<form action="' . Tools::safeOutput($_SERVER['REQUEST_URI']) . '" method="post">
                    <input type="hidden" name="Refresh" value="1" />
                    <button type="submit" name="submitRefresh" class="btn btn-default">
                        ' . $this->l('Refresh') . '
                    </button>
                </form>';

    return $button;
}

    private function postProcess()
    {
        $newPath = Tools::getValue('filescatalog_path');
        $newID = Tools::getValue('filescatalog_id');
        Configuration::updateValue(self::MODULE_DATA_PATH_CONFIG, _PS_ROOT_DIR_ . '/' . $newPath);
        Configuration::updateValue(self::MODULE_DATA_ID_CONFIG, $newID);
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
    if ($controller_name === 'cms' && $id_cms == $this->config_id) {
        return $this->getFrontController();
    }
    return null;
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