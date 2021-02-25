function changeson(n) {
    if (musiqueCourante) {
        musiqueCourante.stop();
    }
    musiqueCourante = n;
    musiqueCourante.play();
}