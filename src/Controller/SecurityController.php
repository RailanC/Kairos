<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Repository\UserRepository;

class SecurityController extends AbstractController
{
    public function renderLoginForm(AuthenticationUtils $authenticationUtils): Response
    {
        return $this->render('partials/auth/_login.html.twig', [
            'last_username' => $authenticationUtils->getLastUsername(),
            'error' => $authenticationUtils->getLastAuthenticationError(),
        ]);
    }
    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // if ($this->getUser()) {
        //     return $this->redirectToRoute('target_path');
        // }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/api/verify-email', name: 'api_verify_email', methods: ['POST'])]
    public function verifyUserEmail(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? null;
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['valid' => false, 'message' => 'Invalid email address'], Response::HTTP_BAD_REQUEST); //400 Bad Request
        }

        $existingUser = $userRepository->findOneBy(['email' => $email]); // SELECT * FROM users WHERE email = 'test@example.com' LIMIT 1;
        return new JsonResponse(['exists' => $existingUser !== null, 'email' => $email], Response::HTTP_OK); //200 OK

        /*
        Features to consider for this endpoint:
        - Rate limiting can be implemented using Symfony's RateLimiter component to prevent abuse of the endpoint.
        - CAPTCHA can be added to the frontend form to ensure that the request is coming from a human user.
        - Delay responses for invalid emails can help mitigate brute-force attacks by making it more time-consuming for attackers to test multiple email addresses.
         */
    }
}
