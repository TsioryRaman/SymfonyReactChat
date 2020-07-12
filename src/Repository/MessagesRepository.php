<?php

namespace App\Repository;

use App\Entity\Messages;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Messages|null find($id, $lockMode = null, $lockVersion = null)
 * @method Messages|null findOneBy(array $criteria, array $orderBy = null)
 * @method Messages[]    findAll()
 * @method Messages[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MessagesRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Messages::class);
    }

    // /**
    //  * @return Messages[] Returns an array of Messages objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('m.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Messages
    {
        return $this->createQueryBuilder('m')
            ->andWhere('m.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()me
            ->getOneOrNullResult()
        ;
    }
    */
    public function getMessageJoueur($id):array {
        $query = $this->createQueryBuilder("m")
            ->select("m.id_joueur, m.receipent, m.msg_content, m.time,m.see")
            ->orWhere("m.sender = :id or m.receipent = :id")
            ->setParameter("id",$id)
            ->getQuery()
            ->getResult()
        ;
        return $query;
    }
    public function see($id,$receiver){
        $this->createQueryBuilder("m")
            ->update()
            ->set("m.see","?1")
            ->setParameter(1,true)
            ->andWhere("m.sender = :sender")
            ->andWhere("m.receiver = :receiver")
            ->setParameter("sender",$id)
            ->setParameter("receiver",$receiver)
            ->setMaxResults(1)
            ->getQuery()
            ->execute();
    }
}
