<?php

namespace App\Repository;

use App\Entity\Amis;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Amis|null find($id, $lockMode = null, $lockVersion = null)
 * @method Amis|null findOneBy(array $criteria, array $orderBy = null)
 * @method Amis[]    findAll()
 * @method Amis[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AmisRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Amis::class);
    }

    public function getAllFriends() {

       $query = $this->createQueryBuilder("p")
           ->setMaxResults(10)
           ->orderBy("p.id",ASC)
            ->getQuery()
            ->getResult();
       return $query;

    }

    public function searchAll($id):array {
        $result =$this->createQueryBuilder("p")
           // ->select("p.id_amis")
            ->orWhere("p.id_user= :id and p.confirmed=1")
            ->orWhere("p.id_amis= :id and p.confirmed=1")
            ->setParameter('id',$id)
            ->getQuery()
            ->getResult()
        ;
        return $result;
    }

    // /**
    //  * @return Amis[] Returns an array of Amis objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Amis
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    public function searchMine($id){
        $query = $this->createQueryBuilder("a")
            ->andWhere("a.confirmed is Null")
            ->andWhere("a.id_amis = :id")
            ->setParameter("id",$id)
            ->getQuery()
            ->getResult();

        return $query;
    }
    public function updateFriend($option,$userId,$amisId){
         $this->createQueryBuilder("a")
            ->update()
            ->set("a.confirmed","?1")
            ->setParameter(1,$option)
            ->andWhere("a.id_user = :userId")
            ->andWhere("a.id_amis = :amisId")
            ->setParameter("userId",$amisId)
            ->setParameter("amisId",$userId)
            ->getQuery()
            ->execute();
    }
}
