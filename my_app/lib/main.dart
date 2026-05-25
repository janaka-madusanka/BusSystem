import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const BusConductorApp());
}

const String apiBaseUrl = 'http://localhost:5000/api';

class BusConductorApp extends StatelessWidget {
  const BusConductorApp({super.key});

  @override
  Widget build(BuildContext context) {
    const green = Color(0xFF16A34A);

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Bus Conductor',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: green,
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF6FBF7),
        appBarTheme: const AppBarTheme(
          backgroundColor: green,
          foregroundColor: Colors.white,
          centerTitle: false,
        ),
        cardTheme: CardThemeData(
          color: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: Color(0xFFDCEFE2)),
          ),
        ),
        inputDecorationTheme: const InputDecorationTheme(
          border: OutlineInputBorder(),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: green, width: 2),
          ),
        ),
        useMaterial3: true,
      ),
      home: const LoginScreen(),
    );
  }
}

class ApiClient {
  ApiClient({this.token});

  final String? token;

  Map<String, String> get headers => {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      };

  Future<Map<String, dynamic>> post(
    String path,
    Map<String, dynamic> body,
  ) async {
    final response = await http.post(
      Uri.parse('$apiBaseUrl$path'),
      headers: headers,
      body: jsonEncode(body),
    );
    return _decode(response);
  }

  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, String>? query,
  }) async {
    final uri = Uri.parse('$apiBaseUrl$path').replace(queryParameters: query);
    final response = await http.get(uri, headers: headers);
    return _decode(response);
  }

  Map<String, dynamic> _decode(http.Response response) {
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode >= 400) {
      throw ApiException(data['message']?.toString() ?? 'Request failed');
    }
    return data;
  }
}

class ApiException implements Exception {
  ApiException(this.message);
  final String message;

  @override
  String toString() => message;
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  bool loading = false;
  String? error;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> login() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final data = await ApiClient().post('/auth/login', {
        'email': emailController.text.trim(),
        'password': passwordController.text,
      });
      final user = data['user'] as Map<String, dynamic>;

      if (user['role'] != 'conductor' && user['role'] != 'admin') {
        throw ApiException('Only conductor or admin accounts can use this app');
      }

      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => MainShell(
            api: ApiClient(token: data['token'].toString()),
            user: user,
          ),
        ),
      );
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Icon(
                    Icons.directions_bus_filled,
                    size: 72,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                  const SizedBox(height: 18),
                  Text(
                    'Welcome Conductor',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Login to manage bus timetables.',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 30),
                  TextField(
                    controller: emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(Icons.email_outlined),
                    ),
                  ),
                  const SizedBox(height: 14),
                  TextField(
                    controller: passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      prefixIcon: Icon(Icons.lock_outline),
                    ),
                    onSubmitted: (_) => login(),
                  ),
                  if (error != null) ...[
                    const SizedBox(height: 12),
                    Text(error!, style: const TextStyle(color: Colors.red)),
                  ],
                  const SizedBox(height: 20),
                  FilledButton.icon(
                    onPressed: loading ? null : login,
                    icon: loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.login),
                    label: Text(loading ? 'Logging in...' : 'Login'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({
    super.key,
    required this.api,
    required this.user,
  });

  final ApiClient api;
  final Map<String, dynamic> user;

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      BusListScreen(api: widget.api),
      SettingsScreen(user: widget.user),
    ];

    return Scaffold(
      body: pages[index],
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.directions_bus_outlined),
            selectedIcon: Icon(Icons.directions_bus_filled),
            label: 'Buses',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}

class BusListScreen extends StatefulWidget {
  const BusListScreen({super.key, required this.api});

  final ApiClient api;

  @override
  State<BusListScreen> createState() => _BusListScreenState();
}

class _BusListScreenState extends State<BusListScreen> {
  bool loading = true;
  String? error;
  List<dynamic> buses = [];

  @override
  void initState() {
    super.initState();
    loadBuses();
  }

  Future<void> loadBuses() async {
    setState(() {
      loading = true;
      error = null;
    });

    try {
      final response = await widget.api.get('/buses');
      setState(() => buses = response['data'] as List<dynamic>);
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bus List')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: loadBuses,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  if (error != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text(
                        error!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  if (buses.isEmpty)
                    const Padding(
                      padding: EdgeInsets.only(top: 80),
                      child: Center(child: Text('No buses found')),
                    ),
                  for (final item in buses)
                    BusListTile(
                      bus: item as Map<String, dynamic>,
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => BusTimetableScreen(
                              api: widget.api,
                              bus: item,
                            ),
                          ),
                        );
                      },
                    ),
                ],
              ),
            ),
    );
  }
}

class BusListTile extends StatelessWidget {
  const BusListTile({super.key, required this.bus, required this.onTap});

  final Map<String, dynamic> bus;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final route = bus['route'] as Map<String, dynamic>?;

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        onTap: onTap,
        leading: CircleAvatar(
          backgroundColor: Theme.of(context).colorScheme.primaryContainer,
          child: const Icon(Icons.directions_bus),
        ),
        title: Text(bus['busNumber']?.toString() ?? 'Unknown Bus'),
        subtitle: Text(
          '${route?['name'] ?? 'No route'}\n'
          '${route?['origin'] ?? 'Origin'} to ${route?['destination'] ?? 'Destination'}',
        ),
        isThreeLine: true,
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}

class BusTimetableScreen extends StatefulWidget {
  const BusTimetableScreen({
    super.key,
    required this.api,
    required this.bus,
  });

  final ApiClient api;
  final Map<String, dynamic> bus;

  @override
  State<BusTimetableScreen> createState() => _BusTimetableScreenState();
}

class _BusTimetableScreenState extends State<BusTimetableScreen> {
  DateTime selectedDate = DateTime.now();
  Map<String, dynamic>? timetable;
  bool loading = true;
  String? message;
  final List<TripForm> trips = [];

  String get apiDate {
    final day = selectedDate.day.toString().padLeft(2, '0');
    final month = selectedDate.month.toString().padLeft(2, '0');
    return '$day/$month/${selectedDate.year}';
  }

  @override
  void initState() {
    super.initState();
    loadTimetable();
  }

  Future<void> loadTimetable() async {
    setState(() {
      loading = true;
      message = null;
    });

    try {
      final response = await widget.api.get(
        '/timetable',
        query: {
          'bus': widget.bus['_id'].toString(),
          'date': apiDate,
        },
      );

      final list = response['data'] as List<dynamic>;
      setState(() {
        timetable = list.isEmpty ? null : list.first as Map<String, dynamic>;
        setTripsFromTimetable();
        if (timetable == null) {
          message = 'No timetable for $apiDate. Create one now.';
        }
      });
    } catch (e) {
      setState(() => message = e.toString());
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  void setTripsFromTimetable() {
    for (final trip in trips) {
      trip.dispose();
    }
    trips.clear();

    final existingTrips = timetable?['trips'] as List<dynamic>? ?? [];
    if (existingTrips.isEmpty) {
      trips.add(TripForm(number: 1));
      return;
    }

    for (final trip in existingTrips) {
      final value = trip as Map<String, dynamic>;
      trips.add(
        TripForm(
          number: value['tripNumber'] as int? ?? trips.length + 1,
          departure: value['departureTime']?.toString() ?? '',
          arrival: value['arrivalTime']?.toString() ?? '',
          status: value['status']?.toString() ?? 'Scheduled',
        ),
      );
    }
  }

  Future<void> pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2035),
    );
    if (picked == null) return;

    setState(() => selectedDate = picked);
    await loadTimetable();
  }

  Future<void> saveTimetable() async {
    try {
      final validTrips = trips
          .where((trip) =>
              trip.departureController.text.trim().isNotEmpty &&
              trip.arrivalController.text.trim().isNotEmpty)
          .map((trip) => trip.toJson())
          .toList();

      if (validTrips.isEmpty) {
        throw ApiException('Add at least one trip with times');
      }

      final response = await widget.api.post(
        '/timetable/bus/${widget.bus['_id']}',
        {
          'date': apiDate,
          'trips': validTrips,
        },
      );

      setState(() {
        timetable = response['data'] as Map<String, dynamic>;
        message = 'Timetable saved for $apiDate';
        setTripsFromTimetable();
      });
    } catch (e) {
      setState(() => message = e.toString());
    }
  }

  void addTrip() {
    setState(() => trips.add(TripForm(number: trips.length + 1)));
  }

  void removeTrip(int index) {
    if (trips.length == 1) return;
    setState(() {
      trips[index].dispose();
      trips.removeAt(index);
      for (var i = 0; i < trips.length; i++) {
        trips[i].number = i + 1;
      }
    });
  }

  @override
  void dispose() {
    for (final trip in trips) {
      trip.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final route = widget.bus['route'] as Map<String, dynamic>?;

    return Scaffold(
      appBar: AppBar(title: Text(widget.bus['busNumber']?.toString() ?? 'Bus')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: addTrip,
        icon: const Icon(Icons.add),
        label: const Text('Trip'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: loadTimetable,
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            route?['name']?.toString() ?? 'Route',
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '${route?['origin'] ?? 'Origin'} to ${route?['destination'] ?? 'Destination'}',
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: pickDate,
                    icon: const Icon(Icons.calendar_month),
                    label: Text(apiDate),
                  ),
                  if (message != null) ...[
                    const SizedBox(height: 12),
                    Text(message!),
                  ],
                  const SizedBox(height: 12),
                  for (var i = 0; i < trips.length; i++)
                    TripEditor(
                      key: ValueKey(trips[i]),
                      trip: trips[i],
                      onRemove: () => removeTrip(i),
                    ),
                  const SizedBox(height: 88),
                ],
              ),
            ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: FilledButton.icon(
            onPressed: loading ? null : saveTimetable,
            icon: const Icon(Icons.save),
            label: Text(
              timetable == null ? 'Create Timetable' : 'Update Timetable',
            ),
          ),
        ),
      ),
    );
  }
}

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key, required this.user});

  final Map<String, dynamic> user;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.account_circle),
              title: Text('${user['firstName'] ?? ''} ${user['lastName'] ?? ''}'.trim()),
              subtitle: Text('${user['email'] ?? ''}\nRole: ${user['role'] ?? ''}'),
              isThreeLine: true,
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: () {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (_) => false,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class TripEditor extends StatelessWidget {
  const TripEditor({
    super.key,
    required this.trip,
    required this.onRemove,
  });

  final TripForm trip;
  final VoidCallback onRemove;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Trip ${trip.number}',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
                IconButton(
                  tooltip: 'Remove trip',
                  onPressed: onRemove,
                  icon: const Icon(Icons.delete_outline),
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextField(
              controller: trip.departureController,
              decoration: const InputDecoration(
                labelText: 'Departure time',
                hintText: '04:15 AM',
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: trip.arrivalController,
              decoration: const InputDecoration(
                labelText: 'Arrival time',
                hintText: '06:20 AM',
              ),
            ),
            const SizedBox(height: 10),
            DropdownButtonFormField<String>(
              value: trip.status,
              decoration: const InputDecoration(labelText: 'Status'),
              items: const [
                DropdownMenuItem(value: 'Scheduled', child: Text('Scheduled')),
                DropdownMenuItem(
                  value: 'In Progress',
                  child: Text('In Progress'),
                ),
                DropdownMenuItem(value: 'Completed', child: Text('Completed')),
                DropdownMenuItem(value: 'Cancelled', child: Text('Cancelled')),
              ],
              onChanged: (value) => trip.status = value ?? 'Scheduled',
            ),
          ],
        ),
      ),
    );
  }
}

class TripForm {
  TripForm({
    required this.number,
    String departure = '',
    String arrival = '',
    this.status = 'Scheduled',
  })  : departureController = TextEditingController(text: departure),
        arrivalController = TextEditingController(text: arrival);

  int number;
  String status;
  final TextEditingController departureController;
  final TextEditingController arrivalController;

  Map<String, dynamic> toJson() => {
        'tripNumber': number,
        'departureTime': departureController.text.trim(),
        'arrivalTime': arrivalController.text.trim(),
        'status': status,
      };

  void dispose() {
    departureController.dispose();
    arrivalController.dispose();
  }
}
