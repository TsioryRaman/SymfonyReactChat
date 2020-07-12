<?php

namespace App\Controller;

use App\Entity\Amis;
use App\Repository\AmisRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class FriendController extends AbstractController
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * @param EntityManagerInterface $em
     */
    public function _constructor(EntityManagerInterface $em){
        $this->em = $em;
    }
    /**
     * @Route("/friend", name="friend")
     */
    public function index()
    {
        return $this->render('friend/index.html.twig', [
            'controller_name' => 'FriendController',
        ]);
    }

    public function findFriend(Request $request,UserRepository $userRepository){
        // Receive data friend from react.
        $data = json_decode($request->getContent());
        $id = $data->id;
        $search = $data->search;
        // Get val of Friend.
        $val = $userRepository->searchUser($id,$search);
        $response = new Response();
        $response->headers->set("content-type","application/json");
        $response->setContent(json_encode($val));
        return $response;

    }


    public function GetAllFriend(AmisRepository $friendRepository, UserRepository $repository,Request $request)
    {
        // GET POST DATA.
        $val = json_decode($request->getContent());
        $id = $val->id;
        dump($id);

        $Friends = $friendRepository->searchAll($id);
        $tab = [];
        foreach ($Friends as $i){
            if ($id == $i->getIdAmis()->getId()){
                $tab[$i->getIdUser()->getId()] = $i->getIdUser()->getId();
            }else{
                $tab[$i->getIdAmis()->getId()] = $i->getIdAmis()->getId();
            }
        }

        $allFriend = $repository->getFriendEntity($tab);
        $response = new Response();

        $response->headers->set("Content-Type", "application/json");

        $response->setContent(json_encode($allFriend));

        return $response;

    }

    /**
     * @param Request $request
     * @param UserRepository $userRepository
     * @return Response
     */
    public function addFriend(Request $request, UserRepository $userRepository,EntityManagerInterface $entityManager){
        //Get data from request
        $data = json_decode($request->getContent());
        $id = $data->id;
        $id_friend = $data->id_friend;
        $user = $userRepository->find($id);
        $user_friend = $userRepository->find($id_friend);
        $Ami = new Amis();
        $Ami->setIdUser($user);
        $Ami->setIdAmis($user_friend);
        $entityManager->persist($Ami);
        $entityManager->flush();

       $response = new Response();
       $response->headers->set("content-type","application/json");
       $success = [
           "success" => "okay"
       ];
       $response->setContent(json_encode($success));
       return $response;
        
    }

    public function preventFriendAdd(MessageBusInterface $messageBus,Request $request,UserRepository $userRepository,SerializerInterface $serializer){
        $data = json_decode($request->getContent());
        $id = $data->id;
        $user_id = $data->userId;
        $user = $userRepository->find($user_id);
        $update = new Update("https://chat.com/api/preventFriendAdd",$serializer->serialize($user,'json',['groups'=> 'public' ]),["http://chat.com/user/{$id}"]);
        $messageBus->dispatch($update);
        return new Response();
    }
    public function getAdder(Request $request,AmisRepository $amisRepository,UserRepository $userRepository,SerializerInterface $serializer){
        
        $data = json_decode($request->getContent());
        $id = $data->id;
        $Demandeur = $amisRepository->searchMine($id);
        $data = [];
        $i = 0;

        foreach ($Demandeur as $user){
            $data[$i] = $serializer->serialize($userRepository->find($user->getIdUser()->getId()),"json",['groups'=>'public']);
            $i++;
        }
        
        $response = new Response();
        $response->headers->set("Content-type","application/json");
        $response->setContent(json_encode($data));
        return $response;
    }
    public function UserFriendOptionChecked(Request $request,AmisRepository $amisRepository){

        $data = json_decode($request->getContent());
        $idUser = $data->idUser;
        $option = $data->option;
        $idFriend = $data->idFriends;

        $amisRepository->updateFriend($option,$idUser,$idFriend);

        return new Response();
    }

}
