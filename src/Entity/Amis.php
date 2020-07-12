<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AmisRepository")
 */
class Amis
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="amis")
     */
    private $id_amis;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="user_")
     */
    private $id_user;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $confirmed = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdAmis(): ?User
    {
        return $this->id_amis;
    }

    public function setIdAmis(?User $id_amis): self
    {
        $this->id_amis = $id_amis;

        return $this;
    }

    public function getIdUser(): ?User
    {
        return $this->id_user;
    }

    public function setIdUser(?User $id_user): self
    {
        $this->id_user = $id_user;

        return $this;
    }

    public function getConfirmed(): ?bool
    {
        return $this->confirmed;
    }

    public function setConfirmed(bool $confirmed): self
    {
        $this->confirmed = $confirmed;

        return $this;
    }
}
