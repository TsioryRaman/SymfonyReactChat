<?php


namespace App\service;


use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;

class MercureCookieGenerator
{
    /**
     * @var string
     */
    private $secret;
    public function __construct(string $secret)
    {
        $this->secret = $secret;
    }
    public function generate($id){
        $token = (new Builder())
            ->set('mercure',['subscribe'=>["http://chat.com/user/{$id}"]])
            ->sign(new Sha384(),$this->secret)
            ->getToken();
        return "mercureAuthorization={$token}; Path:/.well-known/mercure; HttpOnly";

    }

}