<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.15.1/moment.min.js"></script>
<script>
var selector = '#work-experience span.space-right';
var format = 'MMM, YYYY';
$(selector).each(function(idx,elem){
  elem = $(elem);
  var dates = elem.text().split('-');
  var date1 = moment(dates[0], format)
  var date2 = dates[1] === "Present" ? moment(dates[1], format) : moment();
  var finalDate = date1.subtract(date2);
  elem.next()[0].childNodes[1].nodeValue = finalDate.fromNow(true);
});
</script>
