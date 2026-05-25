import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:my_app/main.dart';

void main() {
  testWidgets('shows conductor login screen', (WidgetTester tester) async {
    await tester.pumpWidget(const BusConductorApp());

    expect(find.text('Welcome Conductor'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
    expect(find.byIcon(Icons.directions_bus_filled), findsOneWidget);
  });
}
