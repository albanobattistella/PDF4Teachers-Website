<?php $acc=false; $page="About"; require "../php/translator.php"; ?>

<!DOCTYPE html>
<html>
<!--          PAGE INFO          -->
<head>
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	<link rel="icon" href="../data/img/logo.png" />
	<title>PDF4Teachers - Site Officiel | À Propos</title>

	<meta name="viewport" content="width=device-width, initial-scale=1"/>
	<meta charset="utf-8">

	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;1,300&family=Varela+Round&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous">

	<link rel="stylesheet" type="text/css" href="../css/header.css" />
	<link rel="stylesheet" type="text/css" href="../css/main.css" />
	<link rel="stylesheet" type="text/css" href="../css/foot.css" />

</head>

<body>

<!--          HEADER          -->
<header>
	<?php include '../header.php'; ?>
</header>

<!--          MAIN          -->
<main>
	<div class="info">
		<h2><?= t("title.features-description") ?></h2><br/>
		<p>
			<?= t("text.features-description.presentation") ?>
			<br/><br/>
			<?= t("text.features-description.main-feature") ?>
			<br/><br/>
			<?= t("text.features-description.secondary-feature") ?>
		</p>
		<br><hr><br>
		<h2><?= t("title.complementary") ?></h2><br/>
		<p>
			<?= t("text.complementary.disclaimer") ?>
			<br/><br/>
			<?= t("text.complementary.liscence") ?>
			<br/><br/>
			<?= t("text.complementary.more") ?>
		</p>
	</div>
</main>

<!--          FOOTER          -->
<footer>
	<?php include '../footer.php'; ?>
</footer>

<script type='text/javascript' src="//code.jquery.com/jquery-1.10.2.min.js"></script>
<!-- <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script> -->
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
<script type="text/javascript" src="../js/main.js"></script>

</body>
</html>
