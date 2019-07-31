$('.carousel').slick({
    dots: true,
    slidesPerRow: 3,
    rows: 2,
    responsive: [
    {
      breakpoint: 478,
      settings: {
        slidesPerRow: 1,
        rows: 1,
      }
    }
  ]
});