<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\service\MercureCookieGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SendApiController extends AbstractController
{
    private $jwtManager;

    private $em;
    /**
     * @param TokenStorageInterface $storage
     */
    public function __construct(JWTEncoderInterface $jwtManager,EntityManagerInterface $em)
    {
        $this->jwtManager = $jwtManager;
        $this->em = $em;
    }

    public function ListeUtilisateur(Request $request)
    {

        $user = [];
        $response = new Response(json_encode($user), 200, [
            "Content-type" => "application/json"
        ]);

        return $response;
    }

    /**
     * @Route("/send/api", name="send_api")
     */
    public function index()
    {
        return $this->render('send_api/index.html.twig', [
            'controller_name' => 'SendApiController',
        ]);
    }


    public function getUsers(Request $request,UserRepository $userRepository,MercureCookieGenerator $cookieGenerator)
    {
        $token = $request->headers->get("token");
        dump($token);
        $tk = explode(".",$token);
        $tokenPlayload = base64_decode($tk[1]);
        $jwtPlayload = json_decode($tokenPlayload);
        $user = $userRepository->getUser($jwtPlayload->username);
        $response = new Response();
        $response->headers->set("Content-type","application/json");
        $response->headers->set('Set-cookie',$cookieGenerator->generate($user[0]["id"]));
        $response->setContent(json_encode($user));
        return $response;
    }
}