<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\EmailVerifier;
use App\Security\LoginFormAuthenticator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Translation\TranslatorInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier)
    {
    }

    public function renderRegistrationForm(): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);

        return $this->render('partials/auth/_registration.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    #[Route('/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $plainPassword = $form->get('plainPassword')->getData();
                $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

                $entityManager->persist($user);
                $entityManager->flush();

                $email = (new TemplatedEmail())
                ->from(new Address('railan@railanguimaraes.dev', 'Kairos'))
                ->to($user->getEmail())
                ->subject('Please confirm your email for Kairos')
                ->htmlTemplate('registration/registration_confirmation.html.twig')
                ->context([
                    'user' => $user,
                ]);

                $this->emailVerifier->sendEmailConfirmation('app_verify_email', $user, $email);

                if ($request->isXmlHttpRequest() || $request->headers->get('Accept') === 'application/json') {
                    return new JsonResponse([
                        'success' => true,
                        'message' => 'Registration successful! Please check your email.'
                    ]);
                }
                $this->addFlash('success', 'Registration successful! Please check your email to confirm your account.');
                return $this->redirectToRoute('app_home');
            }

            if ($request->isXmlHttpRequest() || $request->headers->get('Accept') === 'application/json') {
                return new JsonResponse([
                    'success' => false,
                    'errors' => (string) $form->getErrors(true, false)
                ], 400);
            }
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(Request $request, TranslatorInterface $translator, EntityManagerInterface $entityManager): Response
    {
        $userId = $request->query->get('id');

        if (!$userId) {
            $this->addFlash('verify_email_error', 'Invalid verification link.');
            return $this->redirectToRoute('app_register');
        }
        
        $user = $entityManager->getRepository(User::class)->find($userId);
        
        if (!$user) {
            $this->addFlash('verify_email_error', 'User not found.');
            return $this->redirectToRoute('app_register');
        }
        
        if ($user->isVerified()) {
            $this->addFlash('verify_email_error', 'Email already verified.');
            return $this->redirectToRoute('app_register');
        }

        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $translator->trans($exception->getReason(), [], 'VerifyEmailBundle'));
            return $this->redirectToRoute('app_register');
        }

        $this->addFlash('success', 'Your email has been verified! You can now log in.');

        // Redirect to your custom verification success page here:
        return $this->redirectToRoute('app_verify_success');
    }

    #[Route('/verify/success', name: 'app_verify_success')]
    public function verifySuccess(): Response
    {
        return $this->render('registration/verify_success.html.twig');
    }
}