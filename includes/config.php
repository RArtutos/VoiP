<?php
session_start();

define('DB_PATH', __DIR__ . '/../data/db.json');

function getDB() {
    if (!file_exists(DB_PATH)) {
        return [
            'clientes' => [],
            'tickets' => [],
            'usuarios' => [
                [
                    'id' => 'admin1',
                    'nombreUsuario' => 'admin',
                    'nombre' => 'Administrador',
                    'rol' => 'admin',
                    'departamento' => 'general',
                    'password' => 'admin123'
                ]
            ]
        ];
    }
    return json_decode(file_get_contents(DB_PATH), true);
}

function saveDB($data) {
    file_put_contents(DB_PATH, json_encode($data, JSON_PRETTY_PRINT));
}

function isLoggedIn() {
    return isset($_SESSION['user']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /nuevaVersion/login.php');
        exit;
    }
}

function getCurrentUser() {
    return $_SESSION['user'] ?? null;
}