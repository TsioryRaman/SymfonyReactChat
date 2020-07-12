<?php

namespace App\Controller;


use App\Entity\Messages;
use App\Entity\User;
use App\Repository\MessagesRepository;
use App\service\MercureCookieGenerator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;

class MessageController extends AbstractController
{
    private $entityManager;
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/message", name="message")
     */
    public function index()
    {
        return $this->render('message/index.html.twig', [
            'controller_name' => 'MessageController',
        ]);
    }
    public function getMessageJoueur(MessagesRepository $messagesRepository,Request $request){

        $val = json_decode($request->getContent());
        dump($val);
        $id = $val->id;
        dump($id);
        $allMessage = $messagesRepository->getMessageJoueur($id);

        $response = new Response();
        $request->headers->set("Content-type","application/json");
        $response->setContent(json_encode($allMessage));

        dump($allMessage);

        return $response;

    }

    public function preventMessage(MessageBusInterface $bus,Request $request){
        $id = $request->headers->get("id_receiver");
        $sender = $request->headers->get("sender");

        $message = $request->getContent();
        $msg = json_decode($message,true);
        if ($msg["message_content"]!== "" && $msg["message_content"]!==null){
            dump("different");
            $data = [
                [
                    "sender" => $sender,
                    "message" => $msg["message_content"]
                ]
            ];
            $update = new Update("https://chat.com/api/preventNotif",json_encode($data),[
                "http://chat.com/user/{$id}"
            ]);
            $bus->dispatch($update);
        }
        return new Response();
    }
    public function getNewMessage(Request $request){

        return new Response();

    }
    public function sendMessage(Request $request){

        $date = new \DateTime("now");
        $id = $request->headers->get("id_sender");
        $receiver = $request->headers->get("id_receiver");
        //$messages = $request->headers->get("message_content");
        $mesg = $request->getContent();
        $message = json_decode($mesg,true);

        if ($message["message_content"]!=="" && $message["message_content"]!==null){
            $messages = $message["message_content"];
            dump("Le message : ",$message);
            $user = $this->entityManager->getRepository(User::class)->find($id);
            dump($user);
            $message = new Messages();
            $message->setIdJoueur($id);
            $message->setSender($user);
            $message->setMsgContent($messages);
            $message->setPseudoJoueur($id);
            $message->setReceipent($receiver);
            $message->setTime($date);
            $message->setSee(false);
            $this->entityManager->persist($message);
            $this->entityManager->flush();
        }
        $result = [
                "statut" => "succes"
                ];
        $response = new Response();
        $response->headers->set("Content-type","application/json");
        $response->setContent(json_encode($result));
        return $response;

    }
    public function getLastMessage(Request $request){
        $id = $request->headers->get("id");
        $finalDate = $request->headers->get("date");

    }
    public function see(Request $request,MessagesRepository $messagesRepository){
        $data = json_decode($request->getContent());
        $id = $data->id;
        $receipent = $data->receipent;
        dump("L'id",$id);
        dump("Receipent",$receipent);
        $message = $messagesRepository->findOneBy(array("sender"=>$id,"receipent"=>$receipent),array("time"=>"DESC"));
        $message->setSee(true);
        $this->entityManager->flush();

        return new Response();
    }
}
