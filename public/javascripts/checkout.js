Stripe.setPublishableKey("enter-your-stripe-token-key-here");

var $form = $("#checkout-form");

$form.submit(function (event) {
  $("#charge-error").addClass("hidden");
  $form.find("button").prop("disabled", true);
  Stripe.card.createToken(
    {
      number: $("#card-number").val(),
      cvc: $("#card-cvc").val(),
      exp_month: $("#card-expiry-month").val(),
      exp_year: $("#card-expiry-year").val(),
      name: $("#card-name").val(),

      address_line1: $("#card-address_line1").val(),
      address_city: $("#card-address_city").val(),
      address_state: $("#card-address_state").val(),
      address_country: $("#card-address_country").val(),
      address_zip: $("#card-address_zip").val(),
    },
    stripeResponseHandler
  );
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) {
    // Problem!

    // Show the errors on the form
    $("#charge-error").text(response.error.message);
    $("#charge-error").removeClass("hidden");
    $form.find("button").prop("disabled", false); // Re-enable submission
  } else {
    // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}
