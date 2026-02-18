<?php

namespace App\DataFixtures;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\User;
use App\Entity\Review;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $categories = [];
        $catNames = ['Cakes', 'Cupcakes', 'Savory', 'Cookies'];
        foreach ($catNames as $name) {
            $category = new Category();
            $category->setName($name);
            $category->setSlug(strtolower($name));
            $manager->persist($category);
            $categories[] = $category;
        }

        $admin = new User();
        $admin->setEmail('admin@kairos.com');
        $admin->setFirstname('Admin');
        $admin->setLastname('Kairos');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'admin123'));
        $admin->setIsVerified(true);
        $manager->persist($admin);

        $client = new User();
        $client->setEmail('client@gmail.com');
        $client->setFirstname('John');
        $client->setLastname('Doe');
        $client->setPassword($this->hasher->hashPassword($client, 'password123'));
        $client->setIsVerified(true);
        $manager->persist($client);

        $productData = [
            ['Chocolate Dream', 'Rich dark chocolate cake', '45.00', 'card1.png', 0],
            ['Red Velvet', 'Classic red velvet with cream cheese', '40.00', 'card2.png', 0],
            ['Vanilla Bean', 'Madagascar vanilla sponge', '35.00', 'card3.png', 0],
            ['Lemon Tart', 'Zesty lemon curd in pastry', '15.00', 'card1.png', 1],
            ['Cheese Quiche', 'Savory cheese and spinach', '12.50', 'card2.png', 2],
            ['Butter Cookies', 'Box of 12 artisanal cookies', '10.00', 'card3.png', 3],
        ];

        foreach ($productData as $data) {
            $product = new Product();
            $product->setTitle($data[0]);
            $product->setDescription($data[1]);
            $product->setPrice($data[2]);
            $product->setImage($data[3]);
            $product->setCategory($categories[$data[4]]);
            $product->setIsActive(true);
            $product->setCreatedAt(new \DateTimeImmutable());
            
            $manager->persist($product);

            $review = new Review();
            $review->setUser($client);
            $review->setProduct($product);
            $review->setRating(rand(4, 5));
            $review->setComment('Absolutely delicious!');
            $review->setIsApproved(true);
            $review->setCreatedAt(new \DateTimeImmutable());
            $manager->persist($review);
        }

        $manager->flush();
    }
}