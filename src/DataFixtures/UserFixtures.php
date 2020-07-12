<?php

namespace App\DataFixtures;

use App\Entity\Amis;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Faker;

class UserFixtures extends Fixture
{
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $tab = new ArrayCollection();
    //    $faker = Faker\Factory::create('fr_FR');
    //    for ($i=0;$i<100;$i++){
      //      $user = new User();
      //      $user->setUsername($faker->userName);
       //    $user->setPassword($this->encoder->encodePassword($user,"Tsiory"));
       //    $user->setRoles(['ROLE USER']);
       //    $tab = [
         //      $i => $user
          // ];
          // $manager->persist($user);
     // }


        $manager->flush();
    }
}
