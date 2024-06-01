document.addEventListener('DOMContentLoaded', function () {
    var acc = document.getElementsByClassName('accordion');
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener('click', function () {
            this.classList.toggle('active');
            var panel = this.nextElementSibling;
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });
    }
});

// scripts.js
document.addEventListener('DOMContentLoaded', function () {
  const toolSection = document.querySelector('.comparison-tool');
  const comparisonToggle = document.getElementById('comparison-toggle');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50% 0px', // Trigger when the section is 50% out of the viewport
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!comparisonToggle.checked) {
          comparisonToggle.checked = true;
          updateComparison(comparisonToggle.checked);
        }
      } else {
        if (comparisonToggle.checked) {
          comparisonToggle.checked = false;
          updateComparison(comparisonToggle.checked);
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(toolSection);
});


    document.getElementById('mp-select').addEventListener('change', function() {
        var email = this.value;
        var emailButton = document.getElementById('email-button');
        emailButton.href = 'mailto:' + email 
                         + '?subject=Concern%20about%20[Your%20Issue]'
                         + '&body=Dear%20[MP%20Name],%0A%0A'
                         + 'I%20am%20writing%20to%20you%20as%20a%20constituent%20of%20your%20electorate%20to%20express%20my%20concerns%20regarding%20[Issue]%20in%20our%20community.%0A%0A'
                         + 'Here%20are%20my%20specific%20concerns:%0A'
                         + '1.%20[Concern%201]%0A'
                         + '2.%20[Concern%202]%0A'
                         + '3.%20[Concern%203]%0A%0A'
                         + 'I%20would%20appreciate%20your%20attention%20to%20this%20matter%20and%20look%20forward%20to%20hearing%20your%20thoughts%20on%20how%20we%20can%20address%20these%20issues.%0A%0A'
                         + 'Thank%20you%20for%20your%20time%20and%20consideration.%0A%0A'
                         + 'Sincerely,%0A'
                         + '[Your%20Name]%0A'
                         + '[Your%20Address]%0A'
                         + '[Your%20Phone%20Number]';
        emailButton.style.display = 'inline-block';
    });
