<?php 

require_once _DIR_ . '/../includes/app.php';

use MVC\Router;

$router = new Router();




// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();