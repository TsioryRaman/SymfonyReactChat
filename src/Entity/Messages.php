<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MessagesRepository")
 */
class Messages
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $id_joueur;

    /**
     * @ORM\Column(type="integer")
     */
    private $receipent;

    /**
     * @ORM\Column(type="text")
     */
    private $msg_content;

    /**
     * @ORM\Column(type="datetime")
     */
    private $time;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="messages")
     * @ORM\JoinColumn(nullable=false)
     */
    private $sender;

    /**
     * @ORM\Column(type="boolean")
     */
    private $see;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdJoueur(): ?int
    {
        return $this->id_joueur;
    }

    public function setIdJoueur(int $id_joueur): self
    {
        $this->id_joueur = $id_joueur;

        return $this;
    }

    public function getPseudoJoueur(): ?string
    {
        return $this->pseudo_joueur;
    }

    public function setPseudoJoueur(string $pseudo_joueur): self
    {
        $this->pseudo_joueur = $pseudo_joueur;

        return $this;
    }

    public function getReceipent(): ?string
    {
        return $this->receipent;
    }

    public function setReceipent(string $receipent): self
    {
        $this->receipent = $receipent;

        return $this;
    }

    public function getMsgContent(): ?string
    {
        return $this->msg_content;
    }

    public function setMsgContent(string $msg_content): self
    {
        $this->msg_content = $msg_content;

        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): self
    {
        $this->time = $time;

        return $this;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    public function getSee(): ?bool
    {
        return $this->see;
    }

    public function setSee(bool $see): self
    {
        $this->see = $see;

        return $this;
    }
}
