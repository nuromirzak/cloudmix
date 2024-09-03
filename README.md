<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/nuromirzak/cloudmix">
    <img src="https://github.com/user-attachments/assets/d6a1c0a6-046e-4203-986e-2cc744f54e7b" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Cloudmix</h3>

  <p align="center">
    Real-time chat with friends and AI bots for smarter conversations
    <br />
    <a href="https://github.com/nuromirzak/cloudmix"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/nuromirzak/cloudmix">View Demo</a>
    ·
    <a href="https://github.com/nuromirzak/cloudmix/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/nuromirzak/cloudmix/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://cloudmix-rho.vercel.app)

This pet project is a real-time chat application developed for educational purposes. It leverages WebSocket technology to enable instant messaging between users. Moreover, the app integrates OpenAI's API, creating AI-powered chatbots that users can interact with when they want to pass the time or practice conversing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![React][React.js]][React-url]
- [![Tailwind][Tailwind]][Tailwind-url]
- [![Vite][Vite]][Vite-url]
- [![Spring Boot][Spring Boot]][Spring Boot-url]
- [![Postgresql][Postgresql]][Postgresql-url]
- [![Openai][Openai]][Openai-url]
- [![Zustand][Zustand]][Zustand-url]
- [![React Router][React Router]][React Router-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

1. Run PostgreSQL database in `backend` directory
   ```sh
   docker-compose -f .\compose.dev.yaml --env-file .\.env.docker up -d
   ```
1. Set the environment variables
   ```sh
   export DB_URL=
   export DB_USERNAME=
   export DB_PASSWORD=
   export SPRING_AI_OPENAI_API_KEY=
   ```
1. Build and run the Spring Boot application in `backend` directory (requires Java 21)
   ```sh
   ./gradlew bootRun
   ```
1. Install NPM packages in `frontend` directory
   ```sh
   npm install
   ```
1. Enter the backend URL in `frontend/.env` file
   ```sh
    VITE_API_BASE_URL=http://localhost:8080
    VITE_WS_URL=ws://localhost:8080/ws
   ```
1. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin nuromirzak/cloudmix
   git remote -v # confirm the changes
   ```
1. Run the frontend application
   ```sh
    npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/nuromirzak/cloudmix/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nuromirzak/cloudmix" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/nuromirzak/cloudmix.svg?style=for-the-badge
[contributors-url]: https://github.com/nuromirzak/cloudmix/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/nuromirzak/cloudmix.svg?style=for-the-badge
[forks-url]: https://github.com/nuromirzak/cloudmix/network/members
[stars-shield]: https://img.shields.io/github/stars/nuromirzak/cloudmix.svg?style=for-the-badge
[stars-url]: https://github.com/nuromirzak/cloudmix/stargazers
[issues-shield]: https://img.shields.io/github/issues/nuromirzak/cloudmix.svg?style=for-the-badge
[issues-url]: https://github.com/nuromirzak/cloudmix/issues
[license-shield]: https://img.shields.io/github/license/nuromirzak/cloudmix.svg?style=for-the-badge
[license-url]: https://github.com/nuromirzak/cloudmix/blob/main/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/nurmukhammed
[product-screenshot]: https://github.com/user-attachments/assets/48121963-7c64-4a72-8310-2c484c34c5b1
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Tailwind]: https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Spring Boot]: https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot
[Spring Boot-url]: https://spring.io/projects/spring-boot
[Postgresql]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[Postgresql-url]: https://www.postgresql.org/
[Openai]: https://img.shields.io/badge/OpenAI-FF6600?style=for-the-badge&logo=openai&logoColor=white
[Openai-url]: https://www.openai.com/
[Zustand]: https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white
[Zustand-url]: https://zustand.surge.sh/
[React Router]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[React Router-url]: https://reactrouter.com/
