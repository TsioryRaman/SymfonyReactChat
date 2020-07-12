<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @Vich\Uploadable()
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("public")
     */
    private $id;

    /**
     * @var string|null
     * @ORM\Column(type="string", length=255)
     */
    private $filename;

    /**
     * @var File|null
     * @Vich\UploadableField(mapping="user_profil", fileNameProperty="filename")
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups("public")
     */
    private $username;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Messages", mappedBy="sender")
     */
    private $messages;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Amis", mappedBy="id_amis")
     */
    private $amis;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Amis", mappedBy="id_user")
     */
    private $user_;

    public function __construct()
    {
        $this->messages = new ArrayCollection();
        $this->amis = new ArrayCollection();
        $this->user_ = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection|Messages[]
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Messages $message): self
    {
        if (!$this->messages->contains($message)) {
            $this->messages[] = $message;
            $message->setSender($this);
        }

        return $this;
    }

    public function removeMessage(Messages $message): self
    {
        if ($this->messages->contains($message)) {
            $this->messages->removeElement($message);
            // set the owning side to null (unless already changed)
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Amis[]
     */
    public function getAmis(): Collection
    {
        return $this->amis;
    }

    public function addAmi(Amis $ami): self
    {
        if (!$this->amis->contains($ami)) {
            $this->amis[] = $ami;
            $ami->setIdAmis($this);
        }

        return $this;
    }

    public function removeAmi(Amis $ami): self
    {
        if ($this->amis->contains($ami)) {
            $this->amis->removeElement($ami);
            // set the owning side to null (unless already changed)
            if ($ami->getIdAmis() === $this) {
                $ami->setIdAmis(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Amis[]
     */
    public function getUser(): Collection
    {
        return $this->user_;
    }

    public function addUser(Amis $user): self
    {
        if (!$this->user_->contains($user)) {
            $this->user_[] = $user;
            $user->setIdUser($this);
        }

        return $this;
    }

    public function removeUser(Amis $user): self
    {
        if ($this->user_->contains($user)) {
            $this->user_->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getIdUser() === $this) {
                $user->setIdUser(null);
            }
        }

        return $this;
    }

    /**
     * @return string|null
     */
    public function getFilename(): ?string
    {
        return $this->filename;
    }

    /**
     * @param string|null $filename
     * @return User
     */
    public function setFilename(?string $filename): User
    {
        $this->filename = $filename;
        return $this;
    }

    /**
     * @return File|null
     */
    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    /**
     * @param File|null $imageFile
     * @return User
     */
    public function setImageFile(?File $imageFile): User
    {
        $this->imageFile = $imageFile;
        return $this;
    }


}
